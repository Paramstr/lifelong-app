export interface ProtocolChapter {
    startTime: string; // "MM:SS"
    title: string;
}

export interface ProtocolData {
    videoUrl: string;
    image?: any; // Require source
    chapters: ProtocolChapter[];
}

export const WRIST_MOBILITY_PROTOCOL: ProtocolData = {
    videoUrl: "https://www.youtube.com/watch?v=mSZWSQSSEjE",
    // Fallback to task-logo if image is missing, but here we provide specific ones
    image: require('../../../../assets/images/protocols/wrist-mobility.png'),
    chapters: [
        {
            "startTime": "0:00",
            "title": "Introduction"
        },
        {
            "startTime": "0:48",
            "title": "Finger Pulses"
        },
        {
            "startTime": "1:26",
            "title": "Palm Pulses"
        },
        {
            "startTime": "1:59",
            "title": "Side-to-Side Palm Rotations"
        },
        {
            "startTime": "2:28",
            "title": "Front Facing Elbow Rotations"
        },
        {
            "startTime": "3:06",
            "title": "Side-to-Side Wrist Stretch"
        },
        {
            "startTime": "3:39",
            "title": "Rear Facing Wrist Stretch Palms Down"
        },
        {
            "startTime": "4:25",
            "title": "Rear Facing Wrist Stretch Palms Up"
        },
        {
            "startTime": "4:45",
            "title": "Rear Facing Elbow Rotations"
        },
        {
            "startTime": "5:31",
            "title": "Forward Facing Wrist Stretch"
        }
    ]
};
