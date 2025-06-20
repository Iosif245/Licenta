FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["ConnectCampus.Api/ConnectCampus.Api.csproj", "ConnectCampus.Api/"]
COPY ["ConnectCampus.Application/ConnectCampus.Application.csproj", "ConnectCampus.Application/"]
COPY ["ConnectCampus.Domain/ConnectCampus.Domain.csproj", "ConnectCampus.Domain/"]
COPY ["ConnectCampus.Infrastructure/ConnectCampus.Infrastructure.csproj", "ConnectCampus.Infrastructure/"]

RUN dotnet restore "ConnectCampus.Api/ConnectCampus.Api.csproj"

COPY . .

WORKDIR "/src/ConnectCampus.Api"
RUN dotnet build "ConnectCampus.Api.csproj" -c Release -o /app/build

RUN dotnet publish "ConnectCampus.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "ConnectCampus.Api.dll"] 