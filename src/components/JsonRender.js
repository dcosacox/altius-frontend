import React from 'react';
const JsonRender = ({ collection }) =>
  Array.isArray(collection) ? (
    <ul>
      {collection.map((item, index) =>
        item && item.children && Array.isArray(item.children) ? (
          <li key={index}>
            {item.name}
            {<JsonRender collection={item.children} />}
          </li>
        ) : (
          <li key={index}> {item && item.name} </li>
        )
      )}
    </ul>
  ) : null;

export default JsonRender;
