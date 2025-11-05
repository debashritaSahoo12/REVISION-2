import React, { useState } from "react";

export default function LaptopCustomizer() {
  const basePrice = 60000;

  // Price mapping for different options
  const priceOptions = {
    processor: { i5: 0, i7: 15000, i9: 30000 },
    ram: { "8GB": 0, "16GB": 8000, "32GB": 16000 },
    storage: { "512GB SSD": 0, "1TB SSD": 10000, "2TB HDD": 5000 },
    color: { Silver: 0, Black: 0, Blue: 0 },
  };

  // Main configuration state
  const [config, setConfig] = useState({
    processor: "",
    ram: "",
    storage: "",
    color: "",
    totalPrice: basePrice,
  });

  // Saved configurations
  const [savedConfigs, setSavedConfigs] = useState([]);

  // Calculate total price dynamically
  const calculatePrice = (updatedConfig) => {
    let total = basePrice;
    if (updatedConfig.processor)
      total += priceOptions.processor[updatedConfig.processor];
    if (updatedConfig.ram) total += priceOptions.ram[updatedConfig.ram];
    if (updatedConfig.storage)
      total += priceOptions.storage[updatedConfig.storage];
    return total;
  };

  // Handle change in any selection
  const handleChange = (key, value) => {
    const updated = { ...config, [key]: value };
    updated.totalPrice = calculatePrice(updated);
    setConfig(updated);
  };

  // Save current configuration
  const handleSave = () => {
    if (!config.processor || !config.ram || !config.storage || !config.color) {
      alert("Please complete all selections before saving!");
      return;
    }
    setSavedConfigs([...savedConfigs, config]);
    alert("Configuration saved!");
  };

  // Reset to defaults
  const handleReset = () => {
    setConfig({
      processor: "",
      ram: "",
      storage: "",
      color: "",
      totalPrice: basePrice,
    });
  };

  // Edit existing saved config
  const handleEdit = (index) => {
    setConfig(savedConfigs[index]);
  };

  // Delete saved config
  const handleDelete = (index) => {
    const newList = savedConfigs.filter((_, i) => i !== index);
    setSavedConfigs(newList);
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h2>💻 Laptop Customizer</h2>

      {/* Configuration Form */}
      <div
        style={{
          border: `2px solid ${config.color || "gray"}`,
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3>Configuration</h3>

        <div>
          <label>Processor: </label>
          <select
            value={config.processor}
            onChange={(e) => handleChange("processor", e.target.value)}
          >
            <option value="">Select</option>
            <option value="i5">Intel i5</option>
            <option value="i7">Intel i7</option>
            <option value="i9">Intel i9</option>
          </select>
        </div>

        <div>
          <label>RAM: </label>
          <select
            value={config.ram}
            onChange={(e) => handleChange("ram", e.target.value)}
          >
            <option value="">Select</option>
            <option value="8GB">8GB</option>
            <option value="16GB">16GB</option>
            <option value="32GB">32GB</option>
          </select>
        </div>

        <div>
          <label>Storage: </label>
          <select
            value={config.storage}
            onChange={(e) => handleChange("storage", e.target.value)}
          >
            <option value="">Select</option>
            <option value="512GB SSD">512GB SSD</option>
            <option value="1TB SSD">1TB SSD</option>
            <option value="2TB HDD">2TB HDD</option>
          </select>
        </div>

        <div>
          <label>Color: </label>
          <select
            value={config.color}
            onChange={(e) => handleChange("color", e.target.value)}
          >
            <option value="">Select</option>
            <option value="Silver">Silver</option>
            <option value="Black">Black</option>
            <option value="Blue">Blue</option>
          </select>
        </div>

        <h3>Total Price: ₹{config.totalPrice.toLocaleString()}</h3>

        <button onClick={handleSave}>💾 Save Configuration</button>
        <button onClick={handleReset} style={{ marginLeft: "10px" }}>
          🔄 Reset
        </button>
      </div>

      {/* Preview */}
      <div
        style={{
          border: `2px solid ${config.color || "gray"}`,
          padding: "15px",
          borderRadius: "10px",
          background: config.color.toLowerCase() || "white",
          color: config.color === "Black" ? "white" : "black",
        }}
      >
        <h3>Preview</h3>
        <p>
          <strong>Processor:</strong> {config.processor || "-"}
        </p>
        <p>
          <strong>RAM:</strong> {config.ram || "-"}
        </p>
        <p>
          <strong>Storage:</strong> {config.storage || "-"}
        </p>
        <p>
          <strong>Color:</strong> {config.color || "-"}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{config.totalPrice.toLocaleString()}
        </p>
      </div>

      {/* Saved Configurations */}
      <div style={{ marginTop: "30px" }}>
        <h3>💾 Saved Configurations</h3>
        {savedConfigs.length === 0 ? (
          <p>No saved configurations yet.</p>
        ) : (
          savedConfigs.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid gray",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>Processor:</strong> {item.processor} |{" "}
                <strong>RAM:</strong> {item.ram} | <strong>Storage:</strong>{" "}
                {item.storage} | <strong>Color:</strong> {item.color}
              </p>
              <p>
                <strong>Total:</strong> ₹{item.totalPrice.toLocaleString()}
              </p>
              <button onClick={() => handleEdit(index)}>✏️ Edit</button>
              <button
                onClick={() => handleDelete(index)}
                style={{ marginLeft: "10px" }}
              >
                🗑️ Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
