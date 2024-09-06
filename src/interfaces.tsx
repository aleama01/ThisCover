import { Url } from "url"

export interface IAlbum {
  id: string,
  title?: string,
  release_date?: Date,
  artists?: Array<any>,
  image?: string,
  url?: string,
  tags?: Array<string>,
}

export interface ISong {
  name: string,
  id: string,
  link: string,
  track_number: number,
}

export interface ISchedule {
  album: IAlbum,
  deadline: Date,
  friend_id: number,
  user_id: number,
  is_active: boolean
}

export interface IUser {
  id: number,
  username: string,
  image_url: string
}