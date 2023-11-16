import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState(null); // [null, setParentCategory
  const [categories, setCategories] = useState([]);

  const [properties, setProperties] = useState([]); // [null, setParentCategory

  const [editedCategory, setEditedCategory] = useState(""); // [null, setEditedCategory
  const [editBtn, setEditBtn] = useState(false); // [null, setEditedCategory

  async function save(event) {
    event.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        value: property.value,
      })),
    };
    await axios.post("/api/categories", data).catch((err) => {
      console.log(err);
    });
    getCategories();
    setParentCategory(null);
    setProperties([]);
    setName(" ");
    setEditBtn(false);
  }
  const editSave = async (event) => {
    event.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        value: property.value,
      })),
    };
    data._id = editedCategory?._id;
    await axios.put(`/api/categories`, data).catch((err) => {
      console.log(err);
    });
    getCategories();
    setEditedCategory("");
    setParentCategory(null);
    setProperties([]);
    setName(" ");
    setEditBtn(false);
  };
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete category "${category.name}"?`,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#d33",
        cancelButtonText: "No",
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/categories/`, { data: { id: category._id } })
            .then((res) => {
              swal.fire(
                "Deleted!",
                "Your category has been deleted.",
                "success"
              );
              getCategories();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
  }
  function addProperty() {
    setProperties((prev) => [...prev, { name: "", value: "" }]);
  }
  function removeProperty(idx) {
    const copyedProperties = [...properties];
    const removedProperties = copyedProperties.filter(
      (_, index) => index !== idx
    );
    setProperties(removedProperties);
  }

  async function getCategories() {
    axios
      .get("/api/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parentCategory?._id || "");
    setProperties(category.properties);
    setEditBtn(true);
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Layout>
      <h1 className="title">Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category "${editedCategory.name}"`
          : `Create New category"${editedCategory.name}"`}
      </label>
      <form>
        <div className="flex gap-1">
          <input
            type="text"
            id="category"
            placeholder={"Categories name"}
            className="py-1"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(event) => setParentCategory(event.target.value)}
            className=" py-1.5"
          >
            <option>no parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Properties</label>
          <button
            type="button"
            onClick={() => addProperty()}
            className="btn btn-secondary mb-2 py-1"
          >
            Add new Property
          </button>
          {properties.length > 0 &&
            properties.map((property, idx) => (
              <div key={idx} className="flex gap-1">
                <input
                  type="text"
                  id="category"
                  placeholder={"Property name (e.g. color, size, etc.)"}
                  className="py-1"
                  value={property.name}
                  onChange={(event) => {
                    const newProperties = [...properties];
                    newProperties[idx].name = event.target.value;
                    setProperties(newProperties);
                  }}
                />
                <input
                  type="text"
                  id="category"
                  placeholder={
                    "Property value, comma separated (e.g. red, blue, green)"
                  }
                  className="py-1"
                  value={property.value}
                  onChange={(event) => {
                    const newProperties = [...properties];
                    newProperties[idx].value = event.target.value;
                    setProperties([newProperties]);
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeProperty(idx)}
                  className="btn btn-danger mb-2.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
        </div>
        <div className="flex space-x-2">
          {editedCategory && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setEditedCategory("");
                setEditBtn(false);
                setName("");
                setParentCategory(null);
                setProperties([]);
              }}
              className="btn btn-secondary py-1"
            >
              Cancel
            </button>
          )}
          {editBtn ? (
            <button
              onClick={(e) => editSave(e)}
              className="btn btn-primary py-1"
            >
              Edit Save
            </button>
          ) : (
            <button onClick={(e) => save(e)} className="btn btn-primary py-1">
              Create Save
            </button>
          )}
        </div>
      </form>
      {!editedCategory && (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Parent Category</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category, idx) => (
                <tr key={category._id}>
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{category.name}</td>
                  <td className="border px-4 py-2">
                    {category?.parentCategory?.name || ""}
                  </td>
                  <td className="border px-4 py-2 space-x-2 w-10">
                    <div className="space-x-2 flex justify-end">
                      <button
                        onClick={() => editCategory(category)}
                        className="btn btn-primary"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="btn btn-danger"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                      {/* </Link> */}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
