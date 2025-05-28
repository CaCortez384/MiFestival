// pages/CreateFestival.jsx
import React, { useState } from "react";

const CreateFestival = () => {
  const [name, setName] = useState("");
  const [days, setDays] = useState(1);
  const [stages, setStages] = useState(["Escenario Principal"]);

  const handleAddStage = () => {
    setStages([...stages, `Escenario ${stages.length + 1}`]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí guardarás el festival en la DB
    console.log({ name, days, stages });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo festival</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del festival"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <label className="block">
          Días del festival:
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="ml-2 px-2 py-1 border rounded"
          >
            {[1, 2, 3].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
        <div>
          <p className="font-semibold">Escenarios:</p>
          {stages.map((stage, index) => (
            <input
              key={index}
              value={stage}
              onChange={(e) =>
                setStages(stages.map((s, i) => (i === index ? e.target.value : s)))
              }
              className="w-full my-1 px-3 py-2 border rounded"
            />
          ))}
          <button
            type="button"
            onClick={handleAddStage}
            className="mt-2 text-sm text-blue-600 underline"
          >
            + Agregar escenario
          </button>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Crear festival
        </button>
      </form>
    </div>
  );
};

export default CreateFestival;
