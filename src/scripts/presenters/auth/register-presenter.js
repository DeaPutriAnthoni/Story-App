import { register } from "../../data/api.js";

const RegisterPresenter = {
  async handleRegister({
    name,
    email,
    password,
    onSuccess,
    onError,
    onLoading,
  }) {
    // Validasi dasar
    if (!name || !email || !password) {
      onError("Nama, email, dan password harus diisi.");
      return;
    }

    if (password.length < 8) {
      onError("Password minimal 8 karakter.");
      return;
    }

    try {
      onLoading(true);
      await register({ name, email, password });
      onSuccess();
    } catch (error) {
      onError(`Error: ${error.message}`);
    } finally {
      onLoading(false);
    }
  },
};

export default RegisterPresenter;