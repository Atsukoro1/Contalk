// Services, models & Interfaces
import { User } from "../../models/user.model";

// Function that allows us to send messages from our socket io instance
import { emitEvent } from "../../loaders/websocketLoader";

// Modules
import { hash, verify } from "argon2";

interface Iterable {
    inBody: string;
    executor: () => void;
}

/**
 * @async
 * @name settingsService
 * @param body 
 * @param user 
 * @returns 
 */
export async function settingsService(
    body: SettingsBody,
    user: User
) : Promise<SettingsError | SettingsResponse> {
    const passwordValid : boolean = await verify(user.password, body.password);
    if(!passwordValid) {
        return {
            error: "Password does not match!",
            statusCode: 401
        };
    };

    delete body.password;

    const willBeChanged : Record<string, any> = {};
    let somethingChanged : boolean = false;

    const iterables : Array<Iterable> = [
        {
            inBody: 'newName',
            executor: async () : Promise<void> => {
                willBeChanged['name'] = body.newName;
            }
        },
        {
            inBody: 'newSurname',
            executor: async () : Promise<void> => {
                willBeChanged['surname'] = body.newSurname;
            }
        },
        {
            inBody: "newPassword",
            executor: async () : Promise<void> => {
                willBeChanged['password'] = await hash(body.newPassword);
            }
        },
        {
            inBody: "newEmail",
            executor: async () : Promise<void> => {
                willBeChanged['email'] = body.newEmail;
            }
        },
        {
            inBody: "newPhone",
            executor: async () : Promise<void> => {
                willBeChanged['phone'] = body.newPhone;
            }
        },
    ];

    iterables.forEach(async iterable => {
        if(body[iterable.inBody]) {
            await iterable.executor();
            somethingChanged = true;
        };
    });

    await User.findByIdAndUpdate(user._id, willBeChanged);

    return {
        success: somethingChanged
    };
};