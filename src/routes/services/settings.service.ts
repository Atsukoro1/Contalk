// Services, models & Interfaces
import { User } from "../../models/user.model";

// Function that allows us to send messages from our socket io instance
import { emitEvent } from "../../loaders/websocketLoader";

// Modules
import { hash, verify } from "argon2";
import { FastifyReply } from "fastify";

interface Iterable {
    inBody: string;
    executor: () => void;
}

/**
 * @async
 * @name settingsService
 * @description This route does let user everything on their account
 * @param {SettingsBody} body Body of the HTTP request 
 * @param user User object with the mongoose document
 * @returns {Promise<SettingsError | SettingsResponse>}
 */
export async function settingsService(
    body: SettingsBody,
    user: User,
    res: FastifyReply
) : Promise<SettingsError | SettingsResponse> {
    const passwordValid : boolean = await verify(user.password, body.password);
    if(!passwordValid) {
        return res.status(401).send({
            error: "Password does not match!"
        });
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

    if(somethingChanged) {
        return res.status(200).send({
            success: true
        });
    } else {
        return res.status(400).send({
            error: "You didn't change anything!"
        });
    }
};