import React, { useState, useEffect } from "react";
import "../styles.css";
import config from "../config";

export default function Products({ apiUrl }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${config.apiUrl}/get_prodcuts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify the content type
          },
          body: JSON.stringify({
            access_token: token,
            page: 1,
            limit: 20,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.oData.list || []); // Assuming `oData` contains the product list
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="container">
        <p>Loading products...</p>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <div className="col-md-12">
        <a
          href="/import-csv"
          className="btn btn-sm btn-primary btn-block pull-right"
        >
          Import Csv
        </a>
      </div>
      <div className="card">
        <h2>Product List</h2>

        {products.length > 0 ? (
          <table className="table table-stripped table-condensed">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>SKU</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.product_name}</td>
                  <td>{product.price}</td>
                  <td>{product.sku}</td>
                  <td>{product.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
