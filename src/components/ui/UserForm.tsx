import { useForm, type SubmitHandler } from 'react-hook-form';
import { type UserInput } from '../../types';
import { useEffect } from 'react'; 

interface UserFormProps {
  onSubmit: (data: UserInput) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: FormValues; 
  mode: 'create' | 'edit'; 
}

export type FormValues = {
  username: string;
  age: number;
  hobbies: string; 
};

export const UserForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  mode,
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: defaultValues, 
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onFormSubmit: SubmitHandler<FormValues> = async (data) => {
    const hobbiesArray = data.hobbies
      .split(',')
      .map((h) => h.trim())
      .filter((h) => h.length > 0);

    const userData: UserInput = {
      username: data.username,
      age: Number(data.age),
      hobbies: hobbiesArray,
    };

    await onSubmit(userData);

    if (mode === 'create') {
      reset();
    }
  };

  const title = mode === 'create' ? 'Create New User' : 'Edit User';
  const buttonLabel = mode === 'create' ? 'Create User' : 'Save Changes';
  const submittingLabel = mode === 'create' ? 'Creating...' : 'Saving...';

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <h3>{title}</h3>
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
        {isSubmitting ? submittingLabel : buttonLabel}
      </button>
    </form>
  );
};