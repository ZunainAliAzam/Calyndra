export interface TableColumn<T> {
  label: string;
  property: string;
  type:
    | 'text'
    | 'image'
    | 'badge'
    | 'progress'
    | 'expand'
    | 'checkbox'
    | 'button'
    | 'date'
    | 'item'
    | 'icon'
    | 'label'
    | 'time'
    | 'currency'
}
