import React from "react";


const FriendDetails = () => {
  return (
    <>
      helo
    </>
  );
};

export default FriendDetails;

export async function getStaticProps({ params }) {
  /*
  const data = await getPostDetails(params.slug);
  let posts = (await getRecentTenPosts("Friends")) || [];
  return {
    props: { post: data, posts: posts },
  };
  */
}
export async function getStaticPaths() {
  /*
  const posts = await getPosts("Friends");
  return {
    paths: posts.map(({ node: { slug } }) => ({ params: { slug } })),
    fallback: false,
  };
  */
}
