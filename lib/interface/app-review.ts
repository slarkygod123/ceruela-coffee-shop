// export interface Review {
//     review_id: number;
//     user_id: number;
//     product_id: number;
//     rating: number;
//     comment: string;
//     review_date: string;
//     user_email: string;
//     product_name: string;
//     user_name: string;
//     location: string;
//   }
  

export interface FormattedReview {
  review_id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  review_date: string;
  user_email: string;
  product_name: string;
  profile_picture?: string;
  user_name: string;
  location: string;
}