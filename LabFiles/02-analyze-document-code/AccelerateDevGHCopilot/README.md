# Library App

## Description

Library App is a .NET console application for managing library patrons and book loans. Library staff can search for patrons by name, view patron details and their book loans, renew memberships, and return or extend book loans. Data is loaded from JSON files, and the solution uses a layered design with dependency injection and xUnit unit tests.

## Project Structure

- `src/`
  - `Library.ApplicationCore/`
    - `Entities/`
      - `Author.cs`
      - `Book.cs`
      - `BookItem.cs`
      - `Loan.cs`
      - `Patron.cs`
    - `Enums/`
      - `EnumHelper.cs`
      - `LoanExtensionStatus.cs`
      - `LoanReturnStatus.cs`
      - `MembershipRenewalStatus.cs`
    - `Interfaces/`
      - `ILoanRepository.cs`
      - `ILoanService.cs`
      - `IPatronRepository.cs`
      - `IPatronService.cs`
    - `Services/`
      - `LoanService.cs`
      - `PatronService.cs`
    - `Library.ApplicationCore.csproj`
  - `Library.Console/`
    - `Json/`
      - `Authors.json`
      - `BookItems.json`
      - `Books.json`
      - `Loans.json`
      - `Patrons.json`
    - `appSettings.json`
    - `CommonActions.cs`
    - `ConsoleApp.cs`
    - `ConsoleState.cs`
    - `Program.cs`
    - `Library.Console.csproj`
  - `Library.Infrastructure/`
    - `Data/`
      - `JsonData.cs`
      - `JsonLoanRepository.cs`
      - `JsonPatronRepository.cs`
    - `Library.Infrastructure.csproj`
- `tests/`
  - `UnitTests/`
    - `ApplicationCore/`
      - `LoanService/`
        - `ExtendLoan.cs`
        - `ReturnLoan.cs`
      - `PatronService/`
        - `RenewMembership.cs`
    - `LoanFactory.cs`
    - `PatronFactory.cs`
    - `UnitTests.csproj`

## Key Classes and Interfaces

- **Entities** (`Library.ApplicationCore/Entities`)
  - `Patron`: a library member with a membership expiration date and loans.
  - `Loan`: a book loan with due date and returned status.
  - `Book`, `BookItem`, `Author`: catalog information.
- **Enums** (`Library.ApplicationCore/Enums`)
  - `LoanReturnStatus`, `LoanExtensionStatus`, `MembershipRenewalStatus`: results of loan and membership operations.
  - `EnumHelper`: helpers for working with enums.
- **Interfaces** (`Library.ApplicationCore/Interfaces`)
  - `ILoanRepository`: `GetLoan(int)`, `UpdateLoan(Loan)`.
  - `ILoanService`: `ReturnLoan(int)`, `ExtendLoan(int)`.
  - `IPatronRepository`: `GetPatron(int)`, `SearchPatrons(string)`, `UpdatePatron(Patron)`.
  - `IPatronService`: `RenewMembership(int)`.
- **Services** (`Library.ApplicationCore/Services`)
  - `LoanService`: business rules for returning and extending loans.
  - `PatronService`: business rules for renewing memberships.
- **Infrastructure** (`Library.Infrastructure/Data`)
  - `JsonData`: loads and saves the JSON data files.
  - `JsonLoanRepository`, `JsonPatronRepository`: JSON-backed repository implementations.
- **Console** (`Library.Console`)
  - `Program`: application entry point; configures dependency injection.
  - `ConsoleApp`: the interactive menu loop.
  - `ConsoleState`: states of the console workflow (`PatronSearch`, `PatronSearchResults`, `PatronDetails`, `LoanDetails`, `Quit`).
  - `CommonActions`: shared menu actions.

## Usage

Prerequisites: the [.NET SDK](https://dotnet.microsoft.com/download) (the console app targets .NET 10; the libraries and tests target .NET 9).

Run the app from the console project folder, because it reads `appSettings.json` from the current directory:

```bash
cd src/Library.Console
dotnet run
```

Search for a patron by name, then use the on-screen options:

- `s` - new search
- `m` - extend the patron's membership
- `r` - mark a book loan as returned
- `e` - extend a book loan
- `q` - quit
- a number - select an item from the list

Run the unit tests:

```bash
dotnet test tests/UnitTests
```

## License

This project is licensed under the MIT License. See the [LICENSE](../../../LICENSE) file for details.
