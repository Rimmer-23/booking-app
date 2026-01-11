import type { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();

    if (!response.ok) {
        if (responseBody.message) {
            throw new Error(responseBody.message);
        } else if (responseBody.errors) {
            throw new Error(responseBody.errors.map((error: any) => error.msg).join(', '));
        } else {
            throw new Error('An error occurred');
        }
    }
}