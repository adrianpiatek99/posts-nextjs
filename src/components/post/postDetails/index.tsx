import React, { useMemo, useState } from "react";
import { fetcher } from "src/utils/fetcher";
import styled from "styled-components";
import useSWR from "swr";
import Link from "next/link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import { PostLikeHandler } from "src/utils/postLikeHandler";
import CustomIconButton from "src/components/customIconButton";
import UserAvatar from "src/components/user/userAvatar";
import ScaleLoading from "src/components/loading/scaleLoading";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PostMoreOptions from "../postMoreOptions";

interface IProps {
	postId;
	isInModal?: boolean;
	initialData?;
}

const PostDetails = ({ postId, isInModal, initialData }: IProps) => {
	const { data, error } = useSWR(
		isInModal && postId && `/api/posts/post/${postId}`,
		fetcher
	);
	const postData = useMemo(() => {
		if (isInModal) return error ? { error } : data;
		return initialData.error ? { error: initialData.error } : initialData.data;
	}, [data, error, initialData, isInModal]);
	const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState<boolean>(false);

	const {
		isLiked,
		likeHandler,
		loading: likeDislikeLoading,
	} = PostLikeHandler({
		likes: postData?.error || !postData ? [] : postData?.likes,
	});

	return (
		<>
			{postData?.error ? (
				<div>{postData.error.message}</div>
			) : !postData ? (
				<ScaleLoading center marginTop={30} />
			) : (
				<Container isInModal={isInModal}>
					<Column1>
						<Link passHref href={`/profile/${postData.creator}`}>
							<a>
								<UserAvatar
									src={postData.creatorImage}
									username={postData.creator}
									size={48}
								/>
							</a>
						</Link>
					</Column1>
					<Column2>
						<UsernameRow>
							<Link passHref href={`/profile/${postData.creator}`}>
								<a>{postData.creator}</a>
							</Link>
							<div style={{ position: "absolute", top: 0, right: 0 }}>
								<div style={{ position: "relative" }}>
									<CustomIconButton
										Icon={MoreHorizIcon}
										size="small"
										ariaLabel="Open more options"
										onClick={() => setMoreOptionsIsOpen((prev) => !prev)}
									/>
									<PostMoreOptions
										isOpen={moreOptionsIsOpen}
										onClose={() => setMoreOptionsIsOpen(false)}
										postId={postData._id}
										postCreator={postData.creator}
									/>
								</div>
							</div>
						</UsernameRow>
						<MessageRow>{postData.message}</MessageRow>
						<ImageContainer>
							<ImageWrapper>
								<ImagePost
									src={postData.image}
									alt={postData.title}
									draggable="false"
									objectFit="cover"
								/>
							</ImageWrapper>
						</ImageContainer>
						{postData.tags.length >= 1 && (
							<TagsRow>
								{postData.tags.map((tag, i) => (
									<Link passHref href={`/tagged/${tag}`} key={`${tag}-${i}`}>
										<a>
											<Tag>{`#${tag}`}</Tag>
										</a>
									</Link>
								))}
							</TagsRow>
						)}
						<Actions isInModal={isInModal}>
							<ActionItem>
								<CustomIconButton
									Icon={ThumbUpAltOutlinedIcon}
									ariaLabel="Like post"
									size="small"
									changeColorOnHover={true}
									active={isLiked}
									disabled={likeDislikeLoading}
									onClick={() =>
										likeHandler({
											postId: postData._id,
										})
									}
								/>
								<span>{postData.likes.length}</span>
							</ActionItem>
							{isInModal && (
								<ActionItem>
									<CustomIconButton
										Icon={OpenInNewIcon}
										ariaLabel="View in new page"
										size="small"
										changeColorOnHover={true}
										href={`/post/${postData._id}`}
									/>
								</ActionItem>
							)}
						</Actions>
					</Column2>
				</Container>
			)}
		</>
	);
};

export default PostDetails;

const Container = styled.div`
	display: flex;
	max-width: 815px;
	margin: ${({ isInModal }) => (isInModal ? "30px auto" : "0 auto")};
	background: ${({ theme }) => theme.colors.background.secondary};
	border-radius: 3px;
	overflow: hidden;
	padding: 0.8rem 1.6rem;
	animation: ${({ isInModal }) => !isInModal && "appear 0.25s ease"};

	@media ${({ theme }) => theme.breakpoints.md} {
	}

	@keyframes appear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

const Column1 = styled.div`
	margin-bottom: auto;
	margin-right: 12px;
`;

const Column2 = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
`;

const UsernameRow = styled.div`
	font-weight: 600;
	font-size: 1.5rem;
	margin-bottom: 4px;
`;

const MessageRow = styled.div`
	display: inline-block;
	font-size: 1.6rem;
	margin-bottom: 8px;
	width: 100%;
	flex-grow: 1;
	overflow-wrap: break-word;
`;

const ImageContainer = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #000;
	width: 100%;
	min-height: 225px;
	max-height: 675px;

	@media ${({ theme }) => theme.breakpoints.md} {
		min-height: 450px;
	}
`;

const ImageWrapper = styled.div`
	max-height: 575px;
	width: 100%;

	@media ${({ theme }) => theme.breakpoints.md} {
		max-height: 675px;
	}
`;

const ImagePost = styled.img`
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	max-height: 575px;

	@media ${({ theme }) => theme.breakpoints.md} {
		max-height: 675px;
	}
`;

const TagsRow = styled.ul`
	display: flex;
	flex-wrap: wrap;
	margin: 10px 0;
	gap: 8px;
	word-break: break-word;
`;

const Tag = styled.li`
	display: inline-block;
	opacity: 0.65;
	font-size: 1.35rem;
	cursor: pointer;
	line-height: 1;

	&.active {
		background: ${({ theme }) => theme.colors.button.primary};
		padding: 4px 6px;
		border-radius: 20px;
		opacity: 1;
	}

	&:hover {
		text-decoration: underline;
	}
`;

const Actions = styled.div`
	display: flex;
	place-content: ${({ isInModal }) =>
		isInModal ? "center space-around" : "center flex-start"};
	gap: 0 10px;
	padding: 1rem;
	gap: 7px;
`;

const ActionItem = styled.div`
	display: flex;
	align-items: center;
	text-transform: none;
	font-size: 1.7rem;
	color: ${({ theme }) => theme.colors.color.primary};
	font-weight: 400;
	transition: all 0.15s ease;

	> span {
		margin-left: 2px;
	}

	.postAction__icon {
		font-size: 1.9rem;
	}
`;