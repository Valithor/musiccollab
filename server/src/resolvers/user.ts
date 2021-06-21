import { User } from "../entities/User";
import { MyContext } from "../types";
import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Publisher, PubSub, Query, Resolver, Root, Subscription } from "type-graphql";
import argon2 from 'argon2'
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 } from "uuid";
import { getConnection } from "typeorm";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];
    @Field(() => User, { nullable: true })
    user?: User;
    @Field(() => String, { nullable: true })
    token?: string;
}

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User,
        @Ctx() { req }: MyContext
    ) {
        if (req.session.userId === user.id) {
            return user.email;
        }
        return "";
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { req, redis }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 3) {
            return {
                errors: [
                    {
                        field: "newPassword",
                        message: "Length must be greater than 3",
                    },
                ]
            };
        }
        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (!userId) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "Token expired",
                    },
                ],
            };
        }
        const userIdNum = parseInt(userId);
        const user = await User.findOne(userIdNum);
        if (!user) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "User no longer exists",
                    },
                ],
            };
        }

        await User.update(
            { id: userIdNum },
            {
                password: await argon2.hash(newPassword),
            }
        );

        await redis.del(key);

        req.session.userId = user.id;
        return { user };

    }


    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis }: MyContext
    ) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return true;
        }
        const token = v4();

        await redis.set(FORGET_PASSWORD_PREFIX + token,
            user.id,
            'ex',
            1000 * 60 * 60 * 24 * 3
        ); //3 days



        sendEmail(
            email,
            `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`
        );
        return true;

    }


    @Query(() => User, { nullable: true })
    me(
        @Ctx() { req }: MyContext
    ) {
        if (!req.session.userId) {
            console.log(req.session)
            return null;
        }
        return User.findOne(req.session.userId);
    }


    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }

        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            //User.create({}).save()
            const result = await getConnection().createQueryBuilder().insert().into(User).values(
                {
                    username: options.username,
                    email: options.email,
                    password: hashedPassword,
                    location: null
                }
            )
                .returning('*')
                .execute();
            user = result.raw[0];
        } catch (err) {
            if (err.code === '23505') {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "Username already taken",
                        },
                    ],
                };
            }

        }
        req.session.userId = user.id;

        return { user };
    }
    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes('@')
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "Username doesn't exist",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password",
                    },
                ],
            };
        }
        req.session.userId = user.id;
        return {
            user,
        };
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx() { req, res }: MyContext
    ) {
        return new Promise((resolve) =>
            req.session.destroy((err: any) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }

    @Mutation(() => Boolean)
    async setLocation(
        @Arg('location') location: string,
        @PubSub("USERS") publish: Publisher<User>,
        @Ctx() { req }: MyContext
    ) {
        if (req.session.userId === undefined)
            return false;
        const userId = req.session.userId;
        const user = await User.findOne(userId);
        if (user) {
            user.location = location;
            await user.save();
            await publish(user);
        }
        return true;
    }
    @Subscription({
        topics: "USERS",
    })
    userChanges(
        @Root() userPayload: User,
    ): User {
        return userPayload;

    }
}