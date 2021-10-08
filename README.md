# The SPLAT Project

## Built for the UWS Food Pantry

- [The SPLAT Project](#the-splat-project)
  - [Built for the UWS Food Pantry](#built-for-the-uws-food-pantry)
  - [Making Changes](#making-changes)
  - [Test Status](#test-status)

## Making Changes

Before you run this project for the first time, make sure you have added your connection string as [outlined in the instructions](https://github.com/csci499-splat/splat-documentation/tree/main/db-howto) and then open the Package Manager Console within Visual Studio. From here on out, any changes we make to the data model can be reflected in the DB by running `Update-Database` within the package manager after someone has pushed the latest migration to Github.

## Test Status

[![.NET Core](https://github.com/csci499-splat/splat/actions/workflows/dotnetcore.yml/badge.svg?branch=main)](https://github.com/csci499-splat/splat/actions/workflows/dotnetcore.yml)

[![React CI](https://github.com/csci499-splat/splat/actions/workflows/react-ci.yml/badge.svg)](https://github.com/csci499-splat/splat/actions/workflows/react-ci.yml)
