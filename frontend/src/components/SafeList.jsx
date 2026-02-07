// frontend/src/components/SafeList.jsx
import React from 'react';

export function SafeList({ items, renderItem, keyExtractor = (item, index) => index }) {
  if (!Array.isArray(items)) return null;
  
  return items.map((item, index) => (
    <React.Fragment key={keyExtractor(item, index)}>
      {renderItem(item, index)}
    </React.Fragment>
  ));
}

// Usage example in your components:
// <SafeList 
//   items={levels} 
//   keyExtractor={(level) => level.id || level._id}
//   renderItem={(level) => <LevelItem level={level} />}
// />