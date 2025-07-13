using CasaBackend.Casa.InterfaceAdapter.DTOs;
using FluentValidation;
using System.Text.Json;

namespace CasaBackend.Casa.API.Validators
{
    public class CommandValidator : AbstractValidator<CommandDto>
    {
        public CommandValidator() 
        {
            RuleFor(dto => dto.DeviceId)
                .InclusiveBetween(1, 13)
                .WithMessage("El dispositivo ID debe ser entre 1 y 13.");
            RuleFor(dto => dto.CommandName)
                .NotEmpty();
            RuleFor(dto => dto.Parameters)
                .Must(HaveValidParameterStructure)
                .WithMessage("Los parámetros deben tener valores válidos.");
        }
        private static bool HaveValidParameterStructure(Dictionary<string, JsonElement>? parameters)
        {
            if (parameters == null) return false;
            foreach (var param in parameters)
            {
                if (param.Value.ValueKind == JsonValueKind.Undefined ||
                    param.Value.ValueKind == JsonValueKind.Null)
                {
                    return false;
                }
            }
            return true;
        }
    }
}
