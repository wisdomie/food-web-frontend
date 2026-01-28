/**
 * NutritionTable Component
 *
 * Displays nutrition information in a table format
 */

import React from 'react';

function NutritionTable({ nutrition }) {
  if (!nutrition) {
    return null;
  }

  const { food_name, serving, nutrients } = nutrition;

  return (
    <div className="nutrition-section">
      <h3>Nutrition Facts</h3>

      {/* Serving Size */}
      {serving && serving.size && (
        <div className="serving-info">
          <strong>Serving Size:</strong>{' '}
          {serving.size.toFixed(0)} {serving.unit}
        </div>
      )}

      {/* Nutrition Table */}
      <table className="nutrition-table">
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {/* Calories */}
          {nutrients.calories && nutrients.calories.value !== null && (
            <tr className="nutrient-row calories">
              <td>
                <strong>Calories</strong>
              </td>
              <td>
                <strong>
                  {nutrients.calories.value.toFixed(0)}{' '}
                  {nutrients.calories.unit}
                </strong>
              </td>
            </tr>
          )}

          {/* Protein */}
          {nutrients.protein && nutrients.protein.value !== null && (
            <tr className="nutrient-row">
              <td>Protein</td>
              <td>
                {nutrients.protein.value.toFixed(1)} {nutrients.protein.unit}
              </td>
            </tr>
          )}

          {/* Carbohydrates */}
          {nutrients.carbohydrates &&
            nutrients.carbohydrates.value !== null && (
              <tr className="nutrient-row">
                <td>Carbohydrates</td>
                <td>
                  {nutrients.carbohydrates.value.toFixed(1)}{' '}
                  {nutrients.carbohydrates.unit}
                </td>
              </tr>
            )}

          {/* Fat */}
          {nutrients.fat && nutrients.fat.value !== null && (
            <tr className="nutrient-row">
              <td>Fat</td>
              <td>
                {nutrients.fat.value.toFixed(1)} {nutrients.fat.unit}
              </td>
            </tr>
          )}

          {/* Fiber */}
          {nutrients.fiber && nutrients.fiber.value !== null && (
            <tr className="nutrient-row">
              <td>Fiber</td>
              <td>
                {nutrients.fiber.value.toFixed(1)} {nutrients.fiber.unit}
              </td>
            </tr>
          )}

          {/* Sugar */}
          {nutrients.sugar && nutrients.sugar.value !== null && (
            <tr className="nutrient-row">
              <td>Sugar</td>
              <td>
                {nutrients.sugar.value.toFixed(1)} {nutrients.sugar.unit}
              </td>
            </tr>
          )}

          {/* Sodium */}
          {nutrients.sodium && nutrients.sodium.value !== null && (
            <tr className="nutrient-row">
              <td>Sodium</td>
              <td>
                {nutrients.sodium.value.toFixed(0)} {nutrients.sodium.unit}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NutritionTable;
