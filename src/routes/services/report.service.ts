// Libraries
import { Socket } from "socket.io";

// Services, models & Interfaces
import { User } from "../../models/user.model";
import { Report } from "../../models/report.model";

// Map with all connected users
import { connectedUsers } from "../../loaders/websocketLoader";

/**
 * @async
 * @name reportService
 * @description Route that lets users report other users
 * @param {ReportBody} body - Body of the HTTP request 
 * @param user - Request author's user profile
 * @returns {Promise<ReportError | ReportResponse>}
 */
export async function reportService(
    body: ReportBody,
    user: User,
    socket: Socket
) : Promise<ReportError | ReportResponse> {
    const target : User = await User.findById(body._id);
    if(!target || target.type === 'BANNED' || target.type === 'ADMIN') {
        return {
            error: "This user does not exist or is already banned!",
            statusCode: 400
        };
    };

    const newReport = new Report({
        reason: body.reason,
        target: body._id,
        creator: user._id
    });

    await newReport.save();

    return {
        success: true
    };
};