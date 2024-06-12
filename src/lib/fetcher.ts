const fetcher = (url: string) =>
  fetch(`${process.env.NEXT_PUBLIC_IAM_HOST}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

export default fetcher;
