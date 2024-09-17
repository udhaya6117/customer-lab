import React, { useState } from "react";
import "./App.css";
import axios from "axios";
const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState(schemaOptions);
  const [selectedSchema, setSelectedSchema] = useState("");
  const handleAddSchema = () => {
    const newSchema = schemaOptions.find((s) => s.value === selectedSchema);

    if (
      newSchema &&
      !selectedSchemas.find((s) => s.value === newSchema.value)
    ) {
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setAvailableSchemas(
        availableSchemas.filter((s) => s.value !== newSchema.value)
      );
      setSelectedSchema("");
    }
  };

  const handleRemoveSchema = (schemaToRemove) => {
    setSelectedSchemas(
      selectedSchemas.filter((s) => s.value !== schemaToRemove.value)
    );
    setAvailableSchemas([...availableSchemas, schemaToRemove]);
  };
  const handleSubmit = async () => {
    const payload = {
      segment_name: segmentName,
      schema: selectedSchemas.map((s) => ({ [s.value]: s.label })),
    };
    console.log("Payload:", payload);

    try {
      const response = await axios.post(
        "https://webhook.site/1222a342-8b4c-43cf-b179-02e7fd7ac4c5",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
      setShowPopup(false); 
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Save Segment</button>

      {showPopup && (
        <div className="popup">
          <h3>Save Segment</h3>
          <div className="splited">
          <div className="box">
          <div className="title-name">
          <label>Enter the name of the segment</label>
          <input
            type="text"
            placeholder="Enter segment name"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />
          </div>
          <div className="spacethepara">
            <p>To save your segment,you need to add the schemas to build the query</p>
          </div>
          <div
            className="blue-box"
            style={{
              border: "1px solid #1ea1ee",
              padding: "10px",
            }}
          >
            {selectedSchemas.length === 0 ? (
              <p>No schema added</p>
            ) : (
              selectedSchemas.map((schema, schemaIndex) => (
                <div className="dropdown" key={schema.value}>
                  <select
                   
                    value={schema.value}
                    onChange={(e) => {
                      const newSchemas = [...selectedSchemas];
                      newSchemas[schemaIndex].value = e.target.value;
                      const selectedSchema = availableSchemas.find(
                        (s) => s.value === e.target.value
                      );
                      if (selectedSchema) {
                        newSchemas[schemaIndex].label = selectedSchema.label;
                      }

                      setSelectedSchemas(newSchemas);
                    }}
                  >
                    <option value={schema.value}>{schema.label}</option>
                    {availableSchemas
                      .filter((schemaGet) => schemaGet.value !== schema.value)
                      .map((schemaGet) => (
                        <option key={schemaGet.value} value={schemaGet.value}>
                          {schemaGet.label}
                        </option>
                      ))}
                  </select>
                  <button onClick={() => handleRemoveSchema(schema)}>-</button>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "25px",
              gap: "25p",
            }}
          >
            <select
              value={selectedSchema}
              onChange={(e) => setSelectedSchema(e.target.value)}
            >
              <option value="">Add schema to segment</option>
              {availableSchemas.map((schema, index) => (
                <option key={index} value={schema.value}>
                  {schema.label}
                </option>
              ))}
            </select>
            <button className="addbtn" onClick={handleAddSchema}>+ Add new schema</button>
          </div>
          </div>
          <div className="button-box">
          <button onClick={handleSubmit}>Save Segment</button>
          <button onClick={() =>{setSelectedSchemas([]);setSelectedSchema("");setSegmentName(""); setShowPopup(false)}}>Close</button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
