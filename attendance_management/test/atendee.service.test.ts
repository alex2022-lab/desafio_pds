import {
    Attendee,
    AttendeeRegistrationDTO,
    AttendeeRepository,
    AttendeeService,
    ValidationError,
    mockRepository // The mock defined above
} from './attendee-service-definitions'; // Assuming definitions are in another file

describe('AttendeeService | Functionality: registerAttendee', () => {
    let service: AttendeeService;

    // Before each test, reset the service and mock for isolation
    beforeEach(() => {
        // Clear previous calls so each test is independent
        jest.clearAllMocks(); 
        service = new AttendeeService(mockRepository);
    });

    // --- CASE 1: Correct Input (The original GREEN case) ---
    it('should register an attendee with valid data and "not confirmed" status', async () => {
        // RED: This test would fail if the Service class and method did not exist.
        
        // ARRANGE
        const validData: AttendeeRegistrationDTO = {
            name: 'Carlos Pérez',
            email: 'carlos@example.com',
            phone: '555-1234'
        };

        // ACT
        const result = await service.registerAttendee(validData);

        // ASSERT
        // 1. Verify that the repository was called to save
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        
        // 2. Verify that the correct object was passed to the repository
        expect(mockRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Carlos Pérez',
                email: 'carlos@example.com',
                status: 'not confirmed' // Verifies the business logic
            })
        );

        // 3. Verify the structure of the response
        expect(result).toHaveProperty('id');
        expect(result.email).toBe(validData.email);
    });
    
    // ------------------------------------------------------------------
    // --- NEGATIVE CASES (Forcing us to write validation code) ---
    // ------------------------------------------------------------------

    // --- CASE 2: Input without Email (Mandatory) ---
    it('should throw ValidationError if the email field is null or empty', async () => {
        // RED: This test fails because the service initially doesn't validate the email.

        // ARRANGE: Email is null/empty
        const dataWithoutEmail: AttendeeRegistrationDTO = {
            name: 'Sara',
            email: ''
        };

        // ACT & ASSERT: We expect the call to throw an error
        await expect(service.registerAttendee(dataWithoutEmail)).rejects.toThrow(ValidationError);
        
        // ASSERT: Crucially, it MUST NOT call the database
        expect(mockRepository.save).not.toHaveBeenCalled();
    });

    // --- CASE 3: Input without Name (Mandatory) ---
    it('should throw ValidationError if the name field is null or empty', async () => {
        // RED: This test fails because the service initially doesn't validate the name.
        
        // ARRANGE: Name is null/empty
        const dataWithoutName: AttendeeRegistrationDTO = {
            name: ' ', // Blank space also counts as empty
            email: 'test@mail.com'
        };

        // ACT & ASSERT: We expect the call to throw an error
        await expect(service.registerAttendee(dataWithoutName)).rejects.toThrow(ValidationError);
        
        // ASSERT: It MUST NOT call the database
        expect(mockRepository.save).not.toHaveBeenCalled();
    });

    // --- CASE 4: Data with Optional Phone ---
    it('should register successfully if the phone field is omitted', async () => {
        // This is a positive case, but validates that an optional field does not cause an error.
        
        // ARRANGE: Phone is not provided
        const dataWithoutPhone: AttendeeRegistrationDTO = {
            name: 'María',
            email: 'm@example.com'
        };

        // ACT
        const result = await service.registerAttendee(dataWithoutPhone);

        // ASSERT
        // The test passes if validation does not fail and the object is saved correctly
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        expect(result.name).toBe('María');
        expect(result.phone).toBeUndefined(); // Verify the optional field is not in the response if not sent
    });
});