import { Url } from "url"

export interface IAlbum {
  title: string,
  author: string,
  image: string,
  time_left: Date,
  tags: Array<string>,
  user: {
    name: string,
    image: string;
  }

}