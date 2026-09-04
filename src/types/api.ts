export type Media = {
  url: string;
  alt: string;
};

export type VenueMeta = {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
};

export type Location = {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number | null;
  lng: number | null;
};

export type ProfileSummary = {
  name: string;
  email: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
};

export type Venue = {
  id: string;
  name: string;
  description: string;
  media: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: VenueMeta;
  location: Location;
  _count?: {
    bookings: number;
  };
};

export type Profile = ProfileSummary & {
  venueManager: boolean;
  _count?: {
    venues: number;
    bookings: number;
  };
};

export type ApiResponse<T> = {
  data: T;
  meta: ApiMeta;
};

export type ApiMeta = {
  totalCount?: number;
  currentPage?: number;
  pageCount?: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  previousPage?: number | null;
  nextPage?: number | null;
};

export type ApiErrorResponse = {
  errors?: Array<{
    code?: string;
    message: string;
    path?: string[];
  }>;
  status?: string;
  statusCode?: number;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: Media;
  banner?: Media;
  venueManager?: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginProfile = Profile & {
  accessToken: string;
};

export type CreateBookingRequest = {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
};

export type UpdateBookingRequest = Partial<
  Pick<CreateBookingRequest, 'dateFrom' | 'dateTo' | 'guests'>
>;

export type CreateVenueRequest = Omit<
  Venue,
  'id' | 'rating' | 'created' | 'updated'
> & {
  rating?: number;
};

export type UpdateVenueRequest = Partial<CreateVenueRequest>;

export type UpdateProfileRequest = Partial<
  Pick<Profile, 'bio' | 'avatar' | 'banner' | 'venueManager'>
>;
