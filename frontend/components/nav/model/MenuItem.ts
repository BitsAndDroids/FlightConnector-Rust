export interface MenuItem {
  route?: string;
  title: string;
  active?: boolean;
  action?: () => void;
}
