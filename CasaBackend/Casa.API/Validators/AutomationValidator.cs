using CasaBackend.Casa.InterfaceAdapter.DTOs;
using FluentValidation;

namespace CasaBackend.Casa.API.Validators
{
    public class AutomationValidator : AbstractValidator<AutomationDto>
    {
        public AutomationValidator()
        {

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede superar los 50 caracteres.");

            RuleFor(x => x.Description)
                .MaximumLength(100).WithMessage("La descripción no puede superar los 200 caracteres.");
        }
    }
}