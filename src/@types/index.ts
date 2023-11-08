export interface IAuthProps {
  name: string;
  email: string;
  password: string;
  password2?: string;
}

export interface ILoginProps {
  email: string;
  password: string;
}

export interface IProductProps {
  id: number;
  name: string;
  description: string;
  price: string;
  imageURL: string;
  category: string;
}

export interface IPrductButtonProps {
  handleCategorySelect: (category: string) => void;
  selectedCategory: string;
  image: string;
  categoryName: string;
}
