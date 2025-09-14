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
                .ChildRules(dev =>
                {
                    dev.RuleFor(d => d.Id)
                       .InclusiveBetween(1, 13)
                       .WithMessage("El ID del dispositivo debe estar entre 1 y 13.");

                    dev.RuleFor(d => d.State)
                       .NotNull()
                       .WithMessage("El estado del dispositivo es obligatorio.");
                });

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede superar los 50 caracteres.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .NotNull()
                .MaximumLength(100).WithMessage("La descripci�n no puede superar los 200 caracteres.");

            RuleFor(x => x.State)
                .NotNull()
                .WithMessage("El estado de la automatizaci�n es obligatorio.");

            RuleFor(x => x.InitTime)
                .NotNull()
                .LessThan(x => x.EndTime)
                .WithMessage("La hora de inicio debe ser menor que la hora de fin.");

            RuleFor(x => x.EndTime)
                .NotNull()
                .WithMessage("La hora de finalizacion es obligatoria");
        }
    }
}