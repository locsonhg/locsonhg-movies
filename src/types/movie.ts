// PhimAPI Movie types
export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
  modified: {
    time: string;
  };
  tmdb?: {
    type: string;
    id: string;
    season?: number;
    vote_average: number;
    vote_count: number;
  };
  imdb?: {
    id: string | null;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Country {
  _id: string;
  name: string;
  slug: string;
}

export interface MovieDetail extends Movie {
  episodes: Episode[];
}

export interface Episode {
  server_name: string;
  server_data: EpisodeData[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface MovieResponse {
  status: boolean;
  items: Movie[];
  pagination: Pagination;
}

export interface MovieResponseV2 {
  status: string;
  msg: string;
  data: {
    seoOnPage: any;
    breadCrumb: any[];
    titlePage: string;
    items: Movie[];
    params: {
      type_slug: string;
      filterCategory: string[];
      filterCountry: string[];
      filterYear: string[];
      filterType: string[];
      sortField: string;
      sortType: string;
      pagination: Pagination;
    };
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail;
  episodes: Episode[];
}

export interface SeoOnPage {
  og_type: string;
  titleHead: string;
  descriptionHead: string;
  og_image: string[];
  og_url: string;
}

export interface BreadCrumb {
  name: string;
  slug?: string;
  position: number;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

// API Parameters
export interface MovieListParams {
  page?: number;
  sort_field?: "modified.time" | "_id" | "year";
  sort_type?: "desc" | "asc";
  sort_lang?: "vietsub" | "thuyet-minh" | "long-tieng";
  category?: string;
  country?: string;
  year?: number;
  limit?: number;
}

export interface SearchParams extends MovieListParams {
  keyword: string;
}

export type MovieType =
  | "phim-bo"
  | "phim-le"
  | "tv-shows"
  | "hoat-hinh"
  | "phim-vietsub"
  | "phim-thuyet-minh"
  | "phim-long-tieng";

export type CategoriesResponse = Category[];
