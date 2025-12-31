import { useParams } from "react-router";
import useGetMedia from "../hooks/useGetMedia";

function MediaPage() {
    const { id } = useParams();
    const mediaInfo = useGetMedia(Number(id));

    return (
        <>{mediaInfo?.title.english}</>
    );
}

export default MediaPage;