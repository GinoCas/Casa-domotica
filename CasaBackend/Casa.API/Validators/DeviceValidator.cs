using CasaBackend.Casa.Core.Entities.ValueObjects;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using FluentValidation;

namespace CasaBackend.Casa.API.Validators
{
    public class DeviceValidator : AbstractValidator<DeviceDto>
    {
        public DeviceValidator()
        {
            RuleFor(dto => dto.Id)
            .InclusiveBetween(1, 13)
            .WithMessage("El dispositivo ID debe ser entre 1 y 13.");
            RuleFor(dto => dto.DeviceType)
                .Must(ValidDeviceType)
                .WithMessage("El tipo de dispositivo no es valido.");
        }
        private static bool ValidDeviceType(string type)
        {
            return Enum.TryParse<DeviceType>(type, out _);
        }
    }
}
