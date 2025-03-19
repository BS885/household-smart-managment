# syntax=docker/dockerfile:1

# שלב הבנייה
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build

WORKDIR /source

COPY . .

WORKDIR /source/SmartManagement.Api

ARG TARGETARCH

RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish -c Release -a ${TARGETARCH/amd64/x64} --use-current-runtime --self-contained false -o /app

# שלב ההרצה
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS final

WORKDIR /app

COPY --from=build /app .

# יצירת משתמש לא-שורש
RUN adduser -D appuser
USER appuser

# חשיפת הפורט והגדרתו לפי Render (ברוב המקרים זה יהיה $PORT)
ENV ASPNETCORE_URLS=http://+:$PORT
EXPOSE 5014

ENTRYPOINT ["dotnet", "SmartManagement.Api.dll"]
