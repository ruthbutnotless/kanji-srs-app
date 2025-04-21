import React from 'react';

function RadicalRelations() {
  const radicals = {
    "大": ["大人", "大切", "大学", "大会", "大事"],
    "工": ["工学", "工事", "工業", "人工", "大工"],
    "入": ["入り口", "入院", "入場", "入所", "入学試験"],
    "力": ["労力", "力持ち", "協力", "実力", "能力"],
    "木": ["木曜日", "木材", "植木", "木陰", "木製"]
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Radical Relationships</h2>
      {Object.entries(radicals).map(([radical, compounds]) => (
        <div key={radical} style={{ marginBottom: '20px' }}>
          <h3>{radical}</h3>
          <p>{compounds.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default RadicalRelations;
