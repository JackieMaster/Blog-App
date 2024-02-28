import { useContext, useState } from "react";
import { AuthContext } from "../../context/Authentication";
import { FaUpload } from "react-icons/fa6";

const CreateBlog = () => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({ title: "", description: "" });
  const [img, setImg] = useState(null);
  const [category, setCategory] = useState("all");
  const formData = new FormData();
  const [loading, setLoading] = useState(false);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", category);
    formData.append("img", img);

    try {
      const response = await fetch(import.meta.env.VITE_AUTH + "create-blog", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create blog post");
      }

      const responseData = await response.json();
      console.log(responseData);
      // Handle successful response here
      // Clear form
      setData({ title: "", description: "" });
      setImg(null);
      // Reset FormData
      formData.delete("fileupload");
      formData.delete("title");
      formData.delete("description");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col sm:p-10 w-[90%] sm:w-[30rem] my-28 xl:w-[35rem] h-[fit-content] gap-8 sm:shadow-xl sm:border  rounded-xl bg-white">
        <h1 className="text-3xl">What&#39;s on your mind?</h1>
        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <input
            type="text"
            name="title"
            required
            className="border rounded-md px-2 h-10 border-purple-500 focus:outline-0"
            placeholder="Title"
            value={data.title}
            onChange={handleForm}
          />
          <textarea
            name="description"
            required
            className="border rounded-md p-2 border-purple-500 focus:outline-0 max-h-[10rem] min-h-[8rem]"
            placeholder="Description"
            value={data.description}
            onChange={handleForm}
          />
          <div className="flex gap-4 flex-col sm:flex-row">
            <select
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              className="border border-purple-500 p-2 rounded-md flex-grow"
            >
              <option value="all">Select Category</option>
              <option value="tech">Tech</option>
              <option value="fashion">Fashion</option>
              <option value="nature">Nature</option>
              <option value="travel">Travel</option>
              <option value="fitness">Fitness</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="finance">Finance</option>
              <option value="news">News</option>
              <option value="business">Business</option>
              <option value="crafts">Crafts</option>
              <option value="music">Music</option>
              <option value="food">Food</option>
              <option value="marketing">Marketing</option>
              <option value="photography">Photography</option>
              <option value="others">Others</option>
            </select>
            <label
              htmlFor="input-file"
              className="cursor-pointer text-white flex-grow bg-purple-500 p-2 rounded-md flex items-center justify-center gap-2"
            >
              <FaUpload /> Upload File
            </label>
            <input
              type="file"
              name="img"
              onChange={(e) => setImg(e.target.files[0])}
              className="hidden"
              id="input-file"
              accept="image/*"
              required
            />
          </div>
          {img && (
            <img
              src={URL.createObjectURL(img)}
              alt="Preview"
              className="aspect-video object-contain"
            />
          )}
          <button
            type="submit"
            className="border h-10 rounded-md bg-purple-500 text-white"
            disabled={loading}
          >
            Create
          </button>
          <h1>{loading && "Processing...Please Wait."}</h1>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
