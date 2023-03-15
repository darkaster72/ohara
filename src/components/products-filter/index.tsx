import Slider from "rc-slider";
import { useState } from "react";

// data
// import productsTypes from './../../utils/data/products-types';
// import productsColors from './../../utils/data/products-colors';
// import productsSizes from './../../utils/data/products-sizes';

const productsTypes: {
  id: string;
  name: string;
  count: string;
}[] = [];
const productsColors: { id: string; label: string; color: string }[] = [];
const productsSizes: { id: string; label: string }[] = [];

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const ProductsFilter = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const addQueryParams = () => {
    // query params changes
  };

  return (
    <form className="products-filter" onChange={addQueryParams}>
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={`products-filter__menu-btn ${
          filtersOpen ? "products-filter__menu-btn--active" : ""
        }`}
      >
        Add Filter <i className="icon-down-open"></i>
      </button>

      <div
        className={`products-filter__wrapper ${
          filtersOpen ? "products-filter__wrapper--open" : ""
        }`}
      >
        <div className="products-filter__block">
          <button type="button">Price</button>
          <div className="products-filter__block__content">
            <Range
              min={200}
              max={1000}
              defaultValue={[300, 500]}
              tipFormatter={(value) => `${value}`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-submit btn--rounded btn--yellow"
        >
          Apply
        </button>
      </div>
    </form>
  );
};

export default ProductsFilter;
