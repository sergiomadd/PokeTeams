using Microsoft.OpenApi.Models;
using NSwag.Generation.Processors;
using NSwag.Generation.Processors.Contexts;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace api.Util
{
    public class AcceptLanguageHeaderParameter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Add Accept-Language header to all operations
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "Accept-Language",
                In = ParameterLocation.Header,
                Description = "The language to be used for the response",
                Required = false,
                Schema = new OpenApiSchema
                {
                    Type = "string"
                }
            });
        }
    }
}
