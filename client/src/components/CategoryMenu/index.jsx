//Import actions, queries, and helpers
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from "../../utils/actions";
import { QUERY_CATEGORIES } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
import { useSelector } from "react-redux";

function CategoryMenu() {
  //dispatch action to update categories
  const dispatch = useDispatch();
  //get categories from store state
  const state = useSelector((state) => state);
  const { categories } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  //update categories in store when  the data is returned from the server
  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise("categories", "put", category);
      });
    } else if (!loading) {
      idbPromise("categories", "get").then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]); //dependencies

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
      <button
        onClick={() => {
          handleClick("");
        }}
      >
        All
      </button>
    </div>
  );
}

export default CategoryMenu;
