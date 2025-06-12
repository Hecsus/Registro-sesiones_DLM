// -------------------------------------------
// 🛡️ MIDDLEWARE DE VALIDACIONES (Express-Validator)
// -------------------------------------------

// Importamos funciones de validación de express-validator
const { check } = require("express-validator");

/**
 * Validaciones para el formulario de registro
 * Se asegura que:
 * - El usuario no esté vacío, sea alfanumérico y tenga mínimo 3 caracteres
 * - El nombre no esté vacío y tenga al menos 3 caracteres
 * - El rol esté presente y sea uno válido (admin o editor)
 * - La contraseña no esté vacía, sea alfanumérica y tenga al menos 5 caracteres
 */
const validateRegister = [
  check("user")
    .notEmpty().withMessage("El usuario es obligatorio")
    .isAlphanumeric().withMessage("Solo se permiten letras y números")
    .isLength({ min: 3 }).withMessage("Debe tener al menos 3 caracteres")
    .trim(),

  check("name")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 3 }).withMessage("Debe tener al menos 3 caracteres")
    .trim(),

  check("rol")
    .notEmpty().withMessage("El rol es obligatorio")
    .isIn(["editor", "admin"]).withMessage("Debe ser editor o admin"),

  check("pass")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isAlphanumeric().withMessage("La contraseña debe ser alfanumérica")
    .isLength({ min: 5 }).withMessage("Debe tener al menos 5 caracteres")
    .trim()
];

/**
 * Validaciones para el formulario de login
 * Se asegura que:
 * - El usuario no esté vacío, sea alfanumérico y tenga mínimo 3 caracteres
 * - La contraseña no esté vacía, sea alfanumérica y tenga al menos 5 caracteres
 */
const validateLogin = [
  check("user")
    .notEmpty().withMessage("El usuario es obligatorio")
    .isAlphanumeric().withMessage("Solo se permiten letras y números")
    .isLength({ min: 3 }).withMessage("Debe tener al menos 3 caracteres")
    .trim(),

  check("pass")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isAlphanumeric().withMessage("Debe ser alfanumérica")
    .isLength({ min: 5 }).withMessage("Debe tener al menos 5 caracteres")
    .trim()
];

// 🚀 Exportamos ambos conjuntos de validaciones para su uso en rutas
module.exports = {
  validateRegister,
  validateLogin
};