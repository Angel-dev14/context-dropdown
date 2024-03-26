export interface Option {
  id: number;
  name: string;
  subOptions?: Option[];
  parent?: Option;
  type: string;
  iconName?: string;
}
