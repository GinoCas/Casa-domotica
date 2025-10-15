using CasaBackend.Casa.InterfaceAdapter.DTOs;
using FluentValidation;

namespace CasaBackend.Casa.API.Validators
{
    public class AutomationValidator : AbstractValidator<AutomationDto>
    {
        public AutomationValidator()
        {
            RuleForEach(x => x.Devices)
                .NotNull()
                .WithMessage("La lista de dispositivos no puede ser nula");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede superar los 50 caracteres.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .NotNull()
                .MaximumLength(100).WithMessage("La descripción no puede superar los 200 caracteres.");

            RuleFor(x => x.State)
                .NotNull()
                .WithMessage("El estado de la automatización es obligatorio.");

            RuleFor(x => x.InitTime)
                .NotNull()
                .LessThan(x => x.EndTime)
                .WithMessage("La hora de inicio debe ser menor que la hora de fin.");

            RuleFor(x => x.EndTime)
                .NotNull()
                .WithMessage("La hora de finalizacion es obligatoria");
            RuleFor(x => x.Days)
                .NotNull()
                .WithMessage("El campo de dias no puede ser nulo.");
        }
    }
}