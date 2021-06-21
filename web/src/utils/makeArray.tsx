import _uniqueId from 'lodash/uniqueId';
import { Item } from '../components/EditingRoom';

export const makeDNDArray = (count: number, elems: any[], _offset: number = 0, isImport: boolean=false): Item[] => Array.from({ length: count }, (_v, k) => k).map(k => ({
  id: `${_uniqueId()}`,
  content: isImport? elems[k] : process.env.NEXT_PUBLIC_API_URL + elems[k].path
}));
