import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UserInput } from '../../types';

interface UserFormProps {
  onSubmit: (data: UserInput) => Promise<void>;
  isSubmitting: boolean;
}

// Define the shape of our form data
type FormValues = {
  username: string;
  age: number;
  hobbies: string; // We'll use a comma-separated string for simplicity
};

export const UserForm = ({ onSubmit, isSubmitting }: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  // This function handles the form's data
  const onFormSubmit: SubmitHandler<FormValues> = async (data) => {
    // Convert the hobbies string into an array
    const hobbiesArray = data.hobbies
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const userData: UserInput = {
      username: data.username,
      age: Number(data.age), // Ensure age is a number
      hobbies: hobbiesArray,
    };

    // Call the parent's submit function
    await onSubmit(userData);
    
    // Clear the form
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <h3>Create New User</h3>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && (
          <p className="error">{errors.username.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          {...register('age', {
            required: 'Age is required',
            valueAsNumber: true,
            min: { value: 1, message: 'Age must be positive' },
          })}
        />
        {errors.age && <p className="error">{errors.age.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="hobbies">Hobbies (comma-separated)</label>
        <input
          id="hobbies"
          {...register('hobbies', { required: 'Hobbies are required' })}
          placeholder="coding, hiking, music"
        />
        {errors.hobbies && <p className="error">{errors.hobbies.message}</p>}
      </div>

      <button type="submit" className="form-button" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};