import userService from "../services/user.service";
import testData from "./test.json";
jest.setTimeout(1000);

describe('Deposit coins', () => {
    describe('Deposit coins', () => {
        it('Reponse', async () => {
            let user = await userService.fetchUserByEmail(testData.register.email);
            if (!user) {
                user = await userService.register(testData.register);
            }
            let result = await userService.deposit(user._id, testData.deposit.data);

            expect(result).not.toBe(null);
            expect(result.data).not.toBe(null);
        });
    })
});