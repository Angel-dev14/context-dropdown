export interface Option {
  id: number;
  name: string;
  subOptions?: Option[];
  type: string;
}
