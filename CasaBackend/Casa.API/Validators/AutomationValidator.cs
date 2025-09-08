using CasaBackend.Casa.InterfaceAdapter.DTOs;
using FluentValidation;

namespace CasaBackend.Casa.API.Validators
{
    public class AutomationValidator : AbstractValidator<AutomationDto>
    {
        public AutomationValidator()
        {
            RuleFor(dto => dto.InitTime)
                .NotNull()
                .WithMessage("La hora de inicio es requerida.");

            RuleFor(dto => dto.EndTime)
                .NotNull()
                .WithMessage("La hora de fin es requerida.")
                .Must((dto, endTime) => endTime > dto.InitTime)
                .WithMessage("La hora de fin debe ser mayor que la hora de inicio.");

            RuleFor(dto => dto.DeviceIds)
                .NotNull()
                .WithMessage("Se requiere al menos un dispositivo.")
                .Must(deviceIds => deviceIds != null && deviceIds.Any())
                .WithMessage("Se requiere al menos un dispositivo.");

            RuleForEach(dto => dto.DeviceIds)
                .InclusiveBetween(1, 13)
                .WithMessage("El ID del dispositivo debe estar entre 1 y 13.");
        }
    }
}