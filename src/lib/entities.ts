interface SpaceParams {
  id: string;
  name: string;
}

/**
 * A `Space` is a logical bucket representing a topic of discussion.
 * `Spaces` don't exhibit any behavior; however, `Profiles` may belong to `Spaces`.
 */
export class Space {
  #id: string;
  #name: string;

  constructor({ id, name }: SpaceParams) {
    this.#id = id;
    this.#name = name;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }
}

interface AccountParams {
  id: string;
  profiles: Profile[];
  isBanned: boolean;
}

/**
 * An `Account` represents a user.
 *
 * `Accounts` have several `Profiles` tied to them. These `Profiles` are not publicly visible;
 * only the `Account` owner may view their various `Profiles`.
 */
export class Account {
  #id: string;
  #profiles: Profile[];
  #isBanned: boolean;

  constructor(params: AccountParams) {
    this.#id = params.id;
    this.#profiles = params.profiles;
    this.#isBanned = params.isBanned;
  }

  get id() {
    return this.#id;
  }

  /**
   * Gets a list of this `Account`'s `Profiles`. This method should NOT be callable
   * by anyone except the `Account` owner.
   */
  get profiles() {
    return this.#profiles;
  }

  get isBanned() {
    return this.#isBanned;
  }

  createProfile(params: { profileId: string; space: Space }) {
    return new Profile({
      id: params.profileId,
      space: params.space,
    });
  }

  ban() {
    this.#isBanned = true;
  }

  unban() {
    this.#isBanned = false;
  }
}

interface ProfileParams {
  id: string;
  space: Space;
}

/**
 * A `Profile` represents a user's interactions with one space.

 * Users always have different profiles across different spaces.
 * When interacting with others in a space, those interactions are tied to a _`Profile`_, not an `Account`.
 */
export class Profile {
  #id: string;
  #space: Space;

  constructor(params: ProfileParams) {
    this.#id = params.id;
    this.#space = params.space;
  }

  get id() {
    return this.#id;
  }

  get space() {
    return this.#space;
  }
}

interface LetterParams {
  id: string;
  content: string;
  author: Profile;
}

/**
 * A `Letter` is an outgoing request for discussion. Anyone can reply to a `Letter`;
 * doing so starts a new `Conversation` associated with the `Letter`. All `Replies` are then
 * associated to that `Conversation`.
 */
export class Letter {
  #id: string;
  #content: string;
  #author: Profile;

  constructor(params: LetterParams) {
    this.#id = params.id;
    this.#content = params.content;
    this.#author = params.author;
  }

  get id() {
    return this.#id;
  }

  get content() {
    return this.#content;
  }

  get author() {
    return this.#author;
  }

  /**
   * Starts a new conversation pertaining to this letter.
   * The only profiles who can interact with this conversation are the letter author
   * and the responder sent in this method.
   */
  startNewConversation(params: { conversationId: string; responder: Profile }) {
    const conversation = new Conversation({
      id: params.conversationId,
      letter: this,
      responder: params.responder,
      createdAt: new Date(),
    });

    return conversation;
  }
}

interface ConversationParams {
  id: string;
  createdAt: Date;
  letter: Letter;
  responder: Profile;
  isPublicationRequested?: boolean;
  isPublicationAccepted?: boolean;
}

/**
 * A `Conversation` is an interaction between two `Profiles`, and is associated with a `Letter`.
 * `Conversations` happen between two people; they converse by sending `Replies` within the context of
 * the same `Conversation`.
 *
 * `Conversations` can be made public if, and only if, both the original `Letter`'s sender and the responder
 * to that `Letter` both agree to publish it. This consent to publish the `Conversation` can be rescinded at any time
 * by either the sender or the responder.
 */
export class Conversation {
  #id: string;
  #createdAt: Date;
  #letter: Letter;
  #responder: Profile;
  #isPublicationRequested: boolean;
  #isPublicationAccepted: boolean;

  constructor(params: ConversationParams) {
    this.#id = params.id;
    this.#createdAt = params.createdAt;
    this.#letter = params.letter;
    this.#responder = params.responder;
    this.#isPublicationRequested = params.isPublicationRequested ?? false;
    this.#isPublicationAccepted = params.isPublicationAccepted ?? false;
  }

  get id() {
    return this.#id;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get letter() {
    return this.#letter;
  }

  get responder() {
    return this.#responder;
  }

  get isPublic() {
    return this.#isPublicationRequested && this.#isPublicationAccepted;
  }

  requestPublication() {
    this.#isPublicationRequested = true;
  }

  rescindPublicationRequest() {
    this.#isPublicationRequested = false;
  }

  acceptPublication() {
    this.#isPublicationAccepted = true;
  }

  rescindPublicationAcceptance() {
    this.#isPublicationAccepted = false;
  }

  /**
   * Sends a reply to this conversation.
   */
  sendReply(params: {
    conversation: Conversation;
    responder: Profile;
    response: string;
    replyId: string;
    replySentAt: Date;
  }) {
    const reply = new Reply({
      id: params.replyId,
      conversation: params.conversation,
      content: params.response,
      author: params.responder,
      createdAt: new Date(),
      sentAt: params.replySentAt,
    });

    return reply;
  }
}

interface ReplyParams {
  id: string;
  conversation: Conversation;
  author: Profile;
  content: string;
  sentAt: Date;
  createdAt: Date;
  reaction?: string;
  label?: Label;
}

/**
 * A `Reply` is a message sent in the context of a `Conversation`.
 *
 * `Replies` are sent by one `Profile`, and that `Profile` must be referred to explicitly by the parent `Conversation`.
 * `Replies` may also have "reactions", which are simple emoji reactions to the contents of the `Reply`,
 * and "labels", specific enumerated tags which speak to the quality of the reply.
 */
export class Reply {
  #id: string;
  #conversation: Conversation;
  #author: Profile;
  #content: string;
  #sentAt: Date;
  #createdAt: Date;
  #reaction?: string;
  #label?: Label;

  constructor(params: ReplyParams) {
    this.#id = params.id;
    this.#conversation = params.conversation;
    this.#author = params.author;
    this.#content = params.content;
    this.#sentAt = params.sentAt;
    this.#createdAt = params.createdAt;
    this.#reaction = params.reaction;
    this.#label = params.label;
  }

  get id() {
    return this.#id;
  }

  get conversation() {
    return this.#conversation;
  }

  get author() {
    return this.#author;
  }

  get content() {
    return this.#content;
  }

  get sentAt() {
    return this.#sentAt;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get reaction(): string | undefined {
    return this.#reaction;
  }

  get label(): Label | undefined {
    return this.#label;
  }

  set reaction(r: string) {
    this.#reaction = r;
  }

  /**
   * Sets the label for this reply. If a label is already set, it cannot be overridden.
   */
  set label(l: Label) {
    if (this.#label !== undefined) {
      // do nothing
    }

    switch (l) {
      case Label.Exemplary:
        break;
      default:
        break;
    }
  }
}

/**
 * A `Label` is a semantic tag which can be assigned to a `Reply`. It speaks to the quality
 * of that `Reply`'s contents.'
 */
export enum Label {
  /**
   * The `Exemplary` label indicates that the person who applied this label to a `Reply` found
   * that reply's contents significant to them. `Exemplary` labels are shown on the recipient's `Profile`.
   */
  Exemplary,
  /**
   * The `Helpful` label indicates that the person who applied this label to a `Reply` found
   * that reply's contents helpful to them.
   */
  Helpful,
  /**
   * The `Malice` label indicates that the person who applied this label to a `Reply` found
   * that reply's contents malicious. The sender of the `Reply` will have their responses
   * in the parent `Conversation` reviewed, and punishment  may be applied to their `Account`
   * based on further judgment.
   */
  Malice,
}
