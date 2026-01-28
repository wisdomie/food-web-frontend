/**
 * UserProfileSetup Component
 *
 * Setup form for user health goals and dietary preferences
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const HEALTH_GOALS = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'gain_weight', label: 'Gain Weight' },
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'eat_healthier', label: 'Eat Healthier' },
  { value: 'more_energy', label: 'More Energy' },
  { value: 'reduce_sugar', label: 'Reduce Sugar' },
  { value: 'heart_health', label: 'Heart Health' },
  { value: 'manage_diabetes', label: 'Manage Diabetes' },
];

const DIETARY_RESTRICTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'gluten_free', label: 'Gluten-Free' },
  { value: 'dairy_free', label: 'Dairy-Free' },
  { value: 'nut_free', label: 'Nut-Free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'low_sodium', label: 'Low Sodium' },
  { value: 'low_carb', label: 'Low Carb' },
  { value: 'keto', label: 'Keto' },
];

function UserProfileSetup({ onComplete, onSkip }) {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [healthGoals, setHealthGoals] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [allergies, setAllergies] = useState('');
  const [calorieTarget, setCalorieTarget] = useState('');

  // Load existing profile if available
  useEffect(() => {
    if (user?.profile) {
      setHealthGoals(user.profile.health_goals || []);
      setDietaryRestrictions(user.profile.dietary_restrictions || []);
      setAllergies((user.profile.allergies || []).join(', '));
      setCalorieTarget(user.profile.calorie_target || '');
    }
  }, [user]);

  const toggleHealthGoal = (value) => {
    setHealthGoals(prev =>
      prev.includes(value)
        ? prev.filter(g => g !== value)
        : [...prev, value]
    );
  };

  const toggleRestriction = (value) => {
    setDietaryRestrictions(prev =>
      prev.includes(value)
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const profileData = {
      health_goals: healthGoals,
      dietary_restrictions: dietaryRestrictions,
      allergies: allergies.split(',').map(a => a.trim()).filter(a => a),
      calorie_target: calorieTarget ? parseInt(calorieTarget) : null
    };

    const result = await updateProfile(profileData);

    setLoading(false);

    if (result.success) {
      if (onComplete) onComplete();
    } else {
      setError(result.error || 'Failed to save profile');
    }
  };

  const renderStep1 = () => (
    <div className="profile-step">
      <h3>What are your health goals?</h3>
      <p className="step-subtitle">Select all that apply</p>

      <div className="checkbox-grid">
        {HEALTH_GOALS.map(goal => (
          <label key={goal.value} className="checkbox-item">
            <input
              type="checkbox"
              checked={healthGoals.includes(goal.value)}
              onChange={() => toggleHealthGoal(goal.value)}
            />
            <span className="checkbox-label">{goal.label}</span>
          </label>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={onSkip}>
          Skip for now
        </button>
        <button className="btn-primary" onClick={() => setStep(2)}>
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="profile-step">
      <h3>Any dietary restrictions?</h3>
      <p className="step-subtitle">Select all that apply</p>

      <div className="checkbox-grid">
        {DIETARY_RESTRICTIONS.map(restriction => (
          <label key={restriction.value} className="checkbox-item">
            <input
              type="checkbox"
              checked={dietaryRestrictions.includes(restriction.value)}
              onChange={() => toggleRestriction(restriction.value)}
            />
            <span className="checkbox-label">{restriction.label}</span>
          </label>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep(1)}>
          Back
        </button>
        <button className="btn-primary" onClick={() => setStep(3)}>
          Next
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="profile-step">
      <h3>Additional Information</h3>
      <p className="step-subtitle">Optional but helps personalize advice</p>

      <div className="form-group">
        <label htmlFor="allergies">Food Allergies</label>
        <input
          type="text"
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="e.g., peanuts, shellfish, eggs"
        />
        <span className="form-hint">Separate multiple allergies with commas</span>
      </div>

      <div className="form-group">
        <label htmlFor="calorieTarget">Daily Calorie Target (optional)</label>
        <input
          type="number"
          id="calorieTarget"
          value={calorieTarget}
          onChange={(e) => setCalorieTarget(e.target.value)}
          placeholder="e.g., 2000"
          min="1000"
          max="5000"
        />
        <span className="form-hint">Leave empty if you're not tracking calories</span>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep(2)}>
          Back
        </button>
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="profile-setup">
      <div className="profile-setup-header">
        <h2>Set Up Your Profile</h2>
        <div className="step-indicator">
          Step {step} of 3
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}

export default UserProfileSetup;
