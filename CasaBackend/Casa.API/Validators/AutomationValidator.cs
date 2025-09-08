using CasaBackend.Casa.InterfaceAdapter.DTOs;
using FluentValidation;

namespace CasaBackend.Casa.API.Validators
{
    public class AutomationValidator : AbstractValidator<AutomationDto>
    {
        public AutomationValidator()
        {
            RuleForEach(dto => dto.DeviceIds)
                .InclusiveBetween(1, 13)
                .WithMessage("El ID del dispositivo debe estar entre 1 y 13.");
        }
    }
}